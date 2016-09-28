import assert from 'assert';

/**
 * This function transforms a generator into a callback that will resume the generator execution each
 * time it is called.
 *
 * @param generator - The function generator to bridge.
 * @returns The bridge
 */
export function multiPassTest(generator: GeneratorFunction): Function {
  assert(generator.constructor.name === 'GeneratorFunction', 'Argument is not a generator function.');
  const validator = generator();
  validator.next(1);

  let done = false;
  return function generatorBridge(...args) {
    if (done) {
      throw new Error('callback called even though there is no more test for it');
    }

    if (args.length === 0) {
      args = void 0;
    } else if (args.length === 1) {
      args = args[0];
    }

    const result = validator.next(args);
    done = result.done;
  };
}
