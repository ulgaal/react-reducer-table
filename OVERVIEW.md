# Table of Contents

- [Table of Contents](#table-of-contents)
  - [Installing](#installing)
  - [Coding](#coding)
    - [Reducer](#reducer)
    - [Component](#component)
- [What's next ?](#whats-next)

## Installing

```sh
npm install react-reducer-table

# or if you use yarn

yarn add react-reducer-table
```

## Coding

To create a simple table with reorderable and resizable columns, do the following:

### Reducer

Create your reducer function to transform actions emitted by the table into state modifications

```jsx
// myReducer.js
import { COLUMN_REORDERING, COLUMN_RESIZING } from "react-reducer-table";

export const tableReducer = (state, action) => {
  switch (action.type) {
    case COLUMN_REORDERING:
      return { ...state, columns: action.columns };
    case COLUMN_RESIZING:
      return {
        ...state,
        columns: columns.map(column =>
          column.id === action.id ? { ...column, width: action.width } : column
        )
      };
  }
};
```

### Component

Instantiate the table and pass your reducer

```jsx
// MyComponent.js
import React, { useReducer } from "react";
import { Table, TableDispatch } from "react-reducer-table";
import { myReducer } from "./myReducer";

const MyComponent = () => {
  // Define the initial state of your table
  const initialState = {
    columns: [
      {
        id: "firstName",
        label: "First name"
      },
      {
        id: "lastName",
        label: "Last name"
      }
    ],
    data: [
      { firstName: "Neil", lastName: "Armstrong" },
      { firstName: "Buzz", lastName: "Aldrin" },
      { firstName: "Michael", lastName: "Collins" }
    ]
  };
  const [state, dispatch] = useReducer(tableReducer, initialState);
  return (
    <div>
      <TableDispatch.Provider value={dispatch}>
        <Table state={state} />
      </TableDispatch.Provider>
    </div>
  );
};
```

# What's next ?

Visit the [storybook](https://ulgaal.github.io/react-reducer-table/storybook-static/) and the documentation to learn about all the possible actions supported out-of-the-box by the table. There are actions to: sort, filter, handle paging, select rows. Since you control the reducer, you can add any other action necessary for your app.
