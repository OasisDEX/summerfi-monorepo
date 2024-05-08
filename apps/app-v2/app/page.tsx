import { ButtonExample, TitleExample } from '@summerfi/app-ui-blocks'
export default function HomePage(): JSX.Element {
  return (
    <div>
      hello!
      <br />
      This is a app-ui-blocks example button
      <ButtonExample test={'HAHA! '}>alo!</ButtonExample>
      <TitleExample>Title example as well</TitleExample>
    </div>
  )
}
