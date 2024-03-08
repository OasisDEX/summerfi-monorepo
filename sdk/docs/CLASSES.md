# Classes

This document contains guidelines and agreements for the declaration of classes and their
inheritance chains

## Inheritance

### Interfaces

The top level interface is used as a pure data container and it must contain all common data that
the class needs. It should be the data that is common to all subclasses. This interface is also used
as a definition of the data that

```
interface IPosition
```

// the same IPosition is the one used for serializing

abstract class Position implements IPosition -> common ====> Abstract if we need specialization,
otherwise normal class { constructor(int x, int y) { this.x = x; this.y = y; }

    get riskRatio()

}

class PositionClient extends Position -> client ==> This is the specialization {

}

class MakerPosition extends Position

Position

PositionExtendedInfo

```

---

Each serializable class must use the SerializationManager to register for serialization.
```
