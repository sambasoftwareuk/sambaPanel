INSERT INTO seo_pages (
  page_key,
  locale,
  status,
  meta_title,
  meta_description,
  og_title,
  og_description,
  canonical_url,
  meta_robots,
  json_ld
)
VALUES
  (
    'homepage',
    'tr-TR',
    'published',
    'Su Soğutma Kulesi Üreticisi | Endüstriyel Sistemler - Greenstep',
    'Endüstriyel su soğutma kulesi üretimi, mühendislik ve sistem çözümleri. Projenize özel hızlı teklif ve teknik destek için Greenstep ile iletişime geçin.',
    'Su Soğutma Kulesi Üreticisi | Endüstriyel Sistemler - Greenstep',
    'Endüstriyel su soğutma kulesi üretimi, mühendislik ve sistem çözümleri. Projenize özel hızlı teklif ve teknik destek için Greenstep ile iletişime geçin.',
    '/',
    'index,follow',
    JSON_OBJECT(
      '@context', 'https://schema.org',
      '@graph', JSON_ARRAY(
        JSON_OBJECT(
          '@type', 'Organization',
          '@id', 'https://www.greenstepcoolingtowers.com/#kurulus',
          'name', 'Greenstep Cooling Towers',
          'url', 'https://www.greenstepcoolingtowers.com',
          'logo', 'https://www.greenstepcoolingtowers.com/greenstep-logo.png'
        ),
        JSON_OBJECT(
          '@type', 'WebSite',
          '@id', 'https://www.greenstepcoolingtowers.com/#websitesi',
          'url', 'https://www.greenstepcoolingtowers.com',
          'name', 'Greenstep Cooling Towers',
          'inLanguage', 'tr-TR'
        )
      )
    )
  ),
  (
    'hizmetler',
    'tr-TR',
    'published',
    'Hizmetlerimiz - Greenstep Su Soğutma Kuleleri',
    'Hizmetlerimiz sayfası - Greenstep Su Soğutma Kuleleri',
    'Hizmetlerimiz - Greenstep Su Soğutma Kuleleri',
    'Hizmetlerimiz sayfası - Greenstep Su Soğutma Kuleleri',
    '/hizmetler',
    'index,follow',
    NULL
  ),
  (
    'iletisim',
    'tr-TR',
    'published',
    'İletişim - Greenstep Su Soğutma Kuleleri',
    'İletişim sayfası - Greenstep Su Soğutma Kuleleri',
    'İletişim - Greenstep Su Soğutma Kuleleri',
    'İletişim sayfası - Greenstep Su Soğutma Kuleleri',
    '/iletisim',
    'index,follow',
    NULL
  ),
  (
    'urunler',
    'tr-TR',
    'published',
    'Ürünlerimiz - Greenstep Su Soğutma Kuleleri',
    'Ürünlerimiz sayfası - Greenstep Su Soğutma Kuleleri',
    'Ürünlerimiz - Greenstep Su Soğutma Kuleleri',
    'Ürünlerimiz sayfası - Greenstep Su Soğutma Kuleleri',
    '/urunler',
    'index,follow',
    NULL
  ),
  (
    'yedek-parcalar',
    'tr-TR',
    'published',
    'Yedek Parçalar - Greenstep Su Soğutma Kuleleri',
    'Yedek Parçalar sayfası - Greenstep Su Soğutma Kuleleri',
    'Yedek Parçalar - Greenstep Su Soğutma Kuleleri',
    'Yedek Parçalar sayfası - Greenstep Su Soğutma Kuleleri',
    '/yedek-parcalar',
    'index,follow',
    NULL
  )
ON DUPLICATE KEY UPDATE
  status = VALUES(status),
  meta_title = VALUES(meta_title),
  meta_description = VALUES(meta_description),
  og_title = VALUES(og_title),
  og_description = VALUES(og_description),
  canonical_url = VALUES(canonical_url),
  meta_robots = VALUES(meta_robots),
  json_ld = VALUES(json_ld);
