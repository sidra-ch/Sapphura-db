import React from 'react';

interface SEOJsonLdProps {
  type: 'Product' | 'Breadcrumb' | 'Organization';
  data: object;
}

const SEOJsonLd: React.FC<SEOJsonLdProps> = ({ type, data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': type, ...data }) }}
    />
  );
};

export default SEOJsonLd;
