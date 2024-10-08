export type Styles = {
  acknowledgement: string
  acknowledgementActive: string
  input: string
  newsletterButtonLabel: string
  newsletterDescription: string
  newsletterInput: string
  newsletterStatusLabel: string
  newsletterSuccessBackground: string
  newsletterSuccessIcon: string
  newsletterSuccessLabel: string
  newsletterSuccessLabelTitle: string
  newsletterSuccessWrapper: string
}

export type ClassNames = keyof Styles

declare const styles: Styles

export default styles
