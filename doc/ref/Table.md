`Table` (component)
===================

The `Table` component is the root component for this library.
It receives a reducer state (as a prop) and dispatcher (through the
`TableDispatch` React context).

The table will trigger the following action to ask the reducer to alter its state.

| Action            |  Parameters  | Description                                         |
|-------------------|--------------|-----------------------------------------------------|
| PAGING            | `<PagingType>` | Triggered when the user changes the page size or navigates to another page |
| COLUMN_REORDERING | `<ColumnsType>` | Triggered when the user reorders columns   |
| COLUMN_RESIZING   | `<ColumnsType>` | Triggered when the user resizes a column   |
| SELECTING   | `<SelectionType>` | Triggered when the user changes the row selection |
| SORTING   | `<SortType>` | Triggered when the user changes table sorting |
| VSCROLL | `<VScrollType>` | Triggered when the table body is scrolled vertically |
| CELL_RANGE | `<CellRangeType>` | Triggered when the user changes the cell range |

`<PagingType>`

| Key        | Type         | Description                                                                        |
|------------|--------------|--------------------------|
| pageIndex  | `<number>`   | The current page index   |
| pageSize   | `<number>`   | The pagination page size |

`<ColumnsType>`

| Key        | Type         | Description                                                                        |
|------------|--------------|--------------------------|
| columns  | `PropTypes.arrayOf(ColumnType)`   | The updated table columns |

`<SelectionType>`

| Key        | Type         | Description                                                                        |
|------------|--------------|--------------------------|
| selectedIds  | `<object>` | The updated Set of currently selected row ids |

`<SortType>`

| Key        | Type         | Description                                                                        |
|------------|--------------|--------------------------|
| sort  | `<string>` | The column id used for sorting, prefixed by '+' for ascending sort or '-' for descending sort (used only for sorting)|

`<VScrollType>`

| Key        | Type         | Description                                                                        |
|------------|--------------|--------------------------|
| scrollTop  | `<number>` | the offset to the top of the table body element |

Props
-----

### `components`

A hash of custom components to replace those provided by the library:

| Key             | Type              | Description                                         |
|-----------------|-------------------|-----------------------------------------------------|
| tr              | `<ComponentType>` | Component to instantiate to wrap each row       |
| Pagination      | `<ComponentType>` | Component to instantiate to provide pagination   |
| PaginationExtra | `<ComponentType>` | Component to instantiate to add extra information to the standard pagination component   |
| Header          | `<ComponentType>` | Component to instantiate for column header  |

`<ComponentType>` is an object, which contains the following keys:

| Key        | Type         | Description                                                                        |
|------------|--------------|------------------------------------------------------------------------------------|
| type      | `<elementType>`   | The React component type |
| props      | `<object>`   | A hash of React properties |

type: `custom`


### `labels`

A hash of key to labels to customize labels used by the table:

| Key             |  Description                                         |
|-----------------|------------------------------------------------------|
| loading         | Displayed while the table is loading data  |
| noData         | Displayed when there is no data in the table |
| toggle         | Title of the checkbox used to select a row |
| toggleAll         | Title of the checkbox used to select all rows                                         |
| rows         | In pagination, title of a page size (should contain a ${value} placeholder where the page size will be injected)  |
| page         | In pagination, 'page' label |
| ofPages         | In pagination, 'of pages' label (should contain a ${pages} placeholder where the number of available pages will be injected) |
| range         | In pagination, a label describing the current range being displayed (should contain ${first}, ${last} and ${total} placeholders where first row index, last row index, and total number of rows will be injected) |
| firstPage         | In pagination, title of the first page button |
| lastPage         | In pagination, title of the last page button |
| nextPage         | In pagination, title of the next page button |
| previousPage         | In pagination, title of the previous page button |

type: `custom`


### `rowIdAttr`

Add this property to activate row selection. It specifies
the column id which is the primary key for rows.

type: `string`


### `state`

The current state of the table, as computed by the reducer

| Key             | Type              | Description                                         |
|-----------------|-------------------|-----------------------------------------------------|
| data | `PropTypes.arrayOf(PropTypes.object)` | An array of table rows |
| columns | `PropTypes.arrayOf(ColumnType)` | An array of table columns |
| total      | `<number>` | The total number of rows in the table (used only for pagination) |
| pageIndex | `<number>` | The current page index (used only for pagination) |
| pageSize  | `<number>` | The page size for table pages (used only for pagination) |
| pageCount | `<number>` | The total number of pages in the table (used only for pagination) |
| sort | `<string>` | The column id used for sorting, prefixed by '+' for ascending sort or '-' for descending sort (used only for sorting)
| selectedIds | `<object>` | a Set of ids currently selected (used only for selection)
| loading | `<bool>` | True if the table is loading its data
| scrollTop | `<number>` | The scrolling offset to apply initially to the table body
| cellRange | `<CellRangeType>` | The range of selected cells. When omitted, cell selection is disabled

`<ColumnType>` is an object, which contains the following keys:

| Key             | Type              | Description                                         |
|-----------------|-------------------|-----------------------------------------------------|
| id              | `<string>`        | Unique id identifying the column
| label           | `<string>`        | The label to display for this column
| resizable       | `<bool>`          | True if the column can be resized
| sortable        | `<bool>`          | True if the column can be sorted
| minWidth        | `<number>`        | The min width of the column (in pixels)
| width           | `<number>`        | The default width of the column (in pixels)
| Cell            | `<elementType>`   | The React component to use for cells corresponding to this column
| Filter          | `<elementType>`   | A React component to use to specify a filter is the column can be filtered
| fixed           | `<bool>`          | True if the column remains fixed horizontally, false (default) otherwise (fixed columns cannot be preceded by a non-fixed column)
| visible         | `<bool>`          | True if the column is visible (default), false otherwise

`<CellRangeType>` is an object, which contains the following keys:

| Key             | Type              | Description                                         |
|-----------------|-------------------|-----------------------------------------------------|
| col             | `<number>`        | The column-index of the leftmost cell in the range
| row             | `<number>`        | The row-index of the topmost cell in the range
| width           | `<number>`        | The number of columns in the range. If zero, no cell is selected
| height          | `<number>`        | The number of rows in the range. If zero, no cell is selected

type: `custom`

