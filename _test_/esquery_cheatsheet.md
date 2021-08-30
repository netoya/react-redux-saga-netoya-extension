### Element has same element

return element

```
var a = require("../modules/products/handlers/routers");
```

```
VariableDeclaration:has(Literal[value="../modules/products/handlers/routers"])
```

### Properties of one Object

return properties

```
var a={
    name:"angel",
    last:"oliver",
    action: async()=>{
        console.log(123);
    }
}
```

```
ObjectExpression>Property
```

### Switch cases array

return cases

```
const initialState = {};

function cajeroReducer(state = initialState, { type, payload }) {
  switch (type) {
    case "hola":
      console.log(123);
      break;
    default:
      return state;
  }
}
```

```
FunctionDeclaration[id.name="cajeroReducer"]>*>SwitchStatement>SwitchCase
```
