export const getDetailsLinks = (rwaFactsLink?: string) => {
  if (rwaFactsLink) {
    return [
      {
        label: 'How it all works',
        id: 'how-it-works',
      },
      {
        label: 'Fact sheet',
        url: rwaFactsLink,
      },
      {
        label: 'Security',
        id: 'security',
      },
      {
        label: 'FAQ',
        id: 'faq',
      },
    ]
  }

  return [
    {
      label: 'How it all works',
      id: 'how-it-works',
    },
    {
      label: 'Advanced yield data',
      id: 'advanced-yield-data',
    },
    {
      label: 'Security',
      id: 'security',
    },
    {
      label: 'FAQ',
      id: 'faq',
    },
  ]
}
