/**
 * @function applyMixins
 * @description Mixins is a way of having multiple inheritance in TypeScript. A mixin is a class that contains methods for
 *              use by other classes without having to be the parent class of those other classes. This is due to a limitation
 *              in Typescript that does not allow multiple inheritance of classes.
 *
 *              There are several ways to implement mixins in TypeScript. The Alternative Method in the following page has been
 *              chosen for being the simpler one:
 *
 *              https://www.typescriptlang.org/docs/handbook/mixins.html
 *
 * @param derivedCtor The class to apply the mixins to
 * @param constructors The mixins to apply
 *
 * @dev The function does not return anything, but it modifies the derivedCtor class
 *
 */
export function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) || Object.create(null),
      )
    })
  })
}
