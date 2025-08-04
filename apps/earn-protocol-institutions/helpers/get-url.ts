export const getInstitutionVaultUrl = ({
  institutionId,
  vaultId,
  page,
}: {
  institutionId: string
  vaultId: string
  page?: string
}): string => {
  return `/${institutionId}/vaults/${vaultId}/${page ?? 'overview'}`
}
export const getInstitutionUrl = ({
  institutionId,
  tab,
}: {
  institutionId: string
  tab?: string
}): string => {
  return `/${institutionId}/${tab ?? 'overview'}`
}
