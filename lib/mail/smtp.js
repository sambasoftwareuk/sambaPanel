import net from "node:net";
import tls from "node:tls";

const CRLF = "\r\n";

function encodeBase64(value) {
  return Buffer.from(String(value), "utf8").toString("base64");
}

function escapeHeader(value = "") {
  return String(value).replace(/[\r\n]+/g, " ").trim();
}

function encodeHeader(value = "") {
  const safeValue = escapeHeader(value);

  if (/^[\x20-\x7E]*$/.test(safeValue)) {
    return safeValue;
  }

  return `=?UTF-8?B?${Buffer.from(safeValue, "utf8").toString("base64")}?=`;
}

function normalizeAddress(value = "") {
  return String(value).replace(/[\r\n<>]/g, "").trim();
}

function encodeQuotedPrintable(value = "") {
  const normalized = String(value).replace(/\r?\n/g, "\n");

  return normalized
    .split("\n")
    .map((line) => {
      const bytes = Buffer.from(line, "utf8");
      const tokens = [];

      for (let index = 0; index < bytes.length; index += 1) {
        const byte = bytes[index];
        const isLast = index === bytes.length - 1;
        const isPrintableAscii = byte >= 33 && byte <= 126 && byte !== 61;
        const isAllowedWhitespace = (byte === 32 || byte === 9) && !isLast;

        if (isPrintableAscii || isAllowedWhitespace) {
          tokens.push(String.fromCharCode(byte));
        } else {
          tokens.push(`=${byte.toString(16).toUpperCase().padStart(2, "0")}`);
        }
      }

      const wrapped = [];
      let current = "";

      for (const token of tokens) {
        if (current.length + token.length > 75) {
          wrapped.push(`${current}=`);
          current = "";
        }

        current += token;
      }

      wrapped.push(current);
      return wrapped.join(CRLF);
    })
    .join(CRLF);
}

function dotStuff(value) {
  return String(value).replace(/\r?\n/g, CRLF).replace(/^\./gm, "..");
}

function createMessage({ from, to, replyTo, subject, text }) {
  const safeSubject = encodeHeader(subject);
  const safeFrom = normalizeAddress(from);
  const safeTo = normalizeAddress(to);
  const safeReplyTo = normalizeAddress(replyTo || from);

  return [
    `From: GreenStep Website <${safeFrom}>`,
    `To: ${safeTo}`,
    `Reply-To: ${safeReplyTo}`,
    `Subject: ${safeSubject}`,
    "MIME-Version: 1.0",
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: quoted-printable",
    "",
    encodeQuotedPrintable(text),
  ].join(CRLF);
}

function readResponse(socket) {
  return new Promise((resolve, reject) => {
    let buffer = "";

    const cleanup = () => {
      socket.off("data", onData);
      socket.off("error", onError);
    };

    const onError = (error) => {
      cleanup();
      reject(error);
    };

    const onData = (chunk) => {
      buffer += chunk.toString("utf8");
      const lines = buffer.split(/\r?\n/).filter(Boolean);
      const lastLine = lines[lines.length - 1];

      if (/^\d{3} /.test(lastLine)) {
        cleanup();
        resolve({ code: Number(lastLine.slice(0, 3)), message: buffer });
      }
    };

    socket.on("data", onData);
    socket.on("error", onError);
  });
}

async function expect(socket, validCodes) {
  const response = await readResponse(socket);
  const codes = Array.isArray(validCodes) ? validCodes : [validCodes];

  if (!codes.includes(response.code)) {
    throw new Error(`SMTP error ${response.code}: ${response.message.trim()}`);
  }

  return response;
}

async function command(socket, line, validCodes) {
  socket.write(`${line}${CRLF}`);
  return expect(socket, validCodes);
}

function connect({ host, port, secure, timeout }) {
  return new Promise((resolve, reject) => {
    const socket = secure ? tls.connect({ host, port, servername: host }) : net.connect({ host, port });

    socket.setTimeout(timeout, () => {
      socket.destroy(new Error("SMTP connection timed out"));
    });

    socket.once("error", reject);
    socket.once("connect", () => {
      socket.off("error", reject);
      resolve(socket);
    });
  });
}

function upgradeToTls(socket, host) {
  return new Promise((resolve, reject) => {
    const secureSocket = tls.connect({ socket, servername: host });
    secureSocket.once("secureConnect", () => resolve(secureSocket));
    secureSocket.once("error", reject);
  });
}

export async function sendSmtpMail({ host, port, secure = false, user, pass, from, to, replyTo, subject, text, timeout = 15000 }) {
  let socket = await connect({ host, port, secure, timeout });
  socket.setEncoding("utf8");

  try {
    await expect(socket, 220);
    const ehloName = process.env.SMTP_EHLO_NAME || "greenstep.local";
    const ehlo = await command(socket, `EHLO ${ehloName}`, 250);

    if (!secure && /STARTTLS/i.test(ehlo.message)) {
      await command(socket, "STARTTLS", 220);
      socket = await upgradeToTls(socket, host);
      socket.setEncoding("utf8");
      await command(socket, `EHLO ${ehloName}`, 250);
    }

    if (user && pass) {
      await command(socket, "AUTH LOGIN", 334);
      await command(socket, encodeBase64(user), 334);
      await command(socket, encodeBase64(pass), 235);
    }

    const envelopeFrom = normalizeAddress(from);
    const envelopeTo = normalizeAddress(to);
    const message = createMessage({ from: envelopeFrom, to: envelopeTo, replyTo, subject, text });

    await command(socket, `MAIL FROM:<${envelopeFrom}>`, 250);
    await command(socket, `RCPT TO:<${envelopeTo}>`, [250, 251]);
    await command(socket, "DATA", 354);
    socket.write(`${dotStuff(message)}${CRLF}.${CRLF}`);
    await expect(socket, 250);
    await command(socket, "QUIT", 221);
  } finally {
    socket.end();
  }
}
