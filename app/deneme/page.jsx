import Link from 'next/link';
import Popup from '../_components/Popup.jsx';

export default function HomePage({ searchParams }) {
  const initialOpen = searchParams?.popup === '1';

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Popup (Server Page + Client Popup)</h1>

      {/* JS’siz aç: aynı sayfaya GET ile ?popup=1 ekle */}
      <form method="GET" style={{ marginTop: '1rem', display: 'inline-block' }}>
        <input type="hidden" name="popup" value="1" />
        <button
          type="submit"
          style={{
            padding: '0.6rem 1rem',
            borderRadius: '10px',
            border: '1px solid #ddd',
            background: 'white',
            cursor: 'pointer',
          }}
        >
          Popup’ı Aç (GET)
        </button>
      </form>

      <div style={{ display: 'inline-block', marginLeft: '1rem' }}>
        <Link href="/other-page" style={{ textDecoration: 'underline' }}>
          Diğer sayfa
        </Link>
      </div>

      {/* initialOpen sunucudan gelir; component kendi içinde yönetir */}
      <Popup initialOpen={initialOpen} title="Merhaba!">
        <p>Bu popup yalnızca component içinde client, sayfa ise server.</p>
        <p>Popup’ı kapatınca URL değişmez; tekrar açmak için butonu/linki kullan.</p>
      </Popup>
    </main>
  );
}
