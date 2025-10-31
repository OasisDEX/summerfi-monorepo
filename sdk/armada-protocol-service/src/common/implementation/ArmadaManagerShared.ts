export abstract class ArmadaManagerShared {
  private readonly _clientId: string | undefined

  constructor(params: { clientId?: string }) {
    this._clientId = params.clientId
  }

  getClientIdOrUndefined(): string | undefined {
    return this._clientId
  }

  getClientIdOrThrow(): string {
    const clientId = this._clientId
    if (!clientId) {
      throw new Error('You must be using makeAdminSdk to access Admin functionality.')
    }
    return clientId
  }
}
