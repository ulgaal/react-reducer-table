## Version 1.5.1 (2023/07/26)
- Added log level definitions and migrated logging to use them
- Mapped native scrollend events to a isScrollEnd property in VSCROLL actions

## Version 1.5.0 (2023/02/08)
- Upgraded dependencies to React@18.2.0

## Version 1.4.0 (2022/09/23)
- Added displayNames to all components
- Fixed bug: metric.measure is not called if a customized tr component inserts elements in the DOM hierarchy between rrt-tr and rrt-td
- Fixed bug: HScroller and VScroller do not remove mouseup listeners
- Froze storybook dependencies ; upgraded react-infotip dependency

## Version 1.3.1 (2021/03/16)
- Fixed peer dependency to target React 17.x

## Version 1.3.0 (2021/01/21)
- Migration to react@17.0.1 and @storybook/react@6.1.15

## Version 1.2.3 (2021/01/15)
- Upgraded internal dependencies
- Removed unused variable
- replaced faker's internet.avatar() which does not work any more with a 9x15 mosaic of ai generated people faces
- Changed flex layout of the scrollable section of tables with fixed columns to stretch to the whole section if columns do not occupy the horizontal space of the section fully
- Enabled logging for Table component
- Made wheel response more homogeneous between FF and chromium

## Version 1.2.2 (2020/09/28)

- Added a 'measure' optional property to column tables to enable external computations of cell autosizing
- Renamed incorrect prefix for selected row CSS class

## Version 1.2.1 (2020/09/25)

- Implemented onwheel to support vertical and horizontal scrolling on tables with fixed columns
- Extracted scroller code to scroll sections in dedicated callbacks
- Made max value more explicit in scrollers
- Centralized logging in a log function which can be activated externally

## Version 1.2.0 (2020/09/18)

- Upgraded to react-infotip@1.1.0
- Fixed unique key warning in Users story
- Forced table body to be the same size as the table
- Improved mousedown in scrollers to handle clicks outside of thumbs
- Fixed unique key warning in Sellers story
- Moved ResizeBar to Data so that resize bar does not overlap HScroller or Pagination
- Fixed bug in column autosizing with fixed columns
- Improved story description
- Added table size observer to force scrollers to refresh when the table resizes
- Refactoring: moved reducers to a dedicated directory
- Refreshed generated documentation
- Added the capability of auto-resizing a column by double clicking on its resizer
- Implemented native autoresize attribute for columns
- Implemented CELL_RANGE action
- Implemented Range rendering
- Added type checking to scrollers
- Reverted to using React-Select for users sample now that relative positionning is supported
- Changed implementation of fixed columns: replaced sticky positionning with an actual horizontal scroller
- Move scroller reducer to a dedicated file
- Moved resizer reducer to a dedicated file
- Renamed Scroller as VScroller
- Fixed export of DefaultCell
- Added API for cell range selection
- Added 'visible' column attribute and migrated user sample and column chooser to showcase the new property
- Added tooltip to users sample to verify compatibility
- Exported DefaultCell
- More css adjustments
- Replaced react-select with regular select (avoid relative placement)
- Prevented drag-and-drop between fixed and free columns
- Created dedicated CSS stylesheets for every cell type
- Activated column chooser and improved layout in miscellaneous column configurations
- Added column chooser panel for Users story
- Provided initial implementation of fixed columns
- Refactored code to put layouts into the config context instead of passing them as props
- Refactored using a context to store components, labels and rowIdAttr instead of passing them as props
- Pass columns from Data to Head, Filters, and Body using a dedicated 'columns' property
- Added new story to test fixed columns feature
- Used generic cell instead for phone and email in samples; moved contexts to a dedicated file
- Exported getProperty utility function
- Fixed use of hasOwnProperty
- Normalized id used in column rule names

## Version 1.1.0 (2020/07/24)

- Fixed filter placement in People and Sellers stories
- Fixed filtering in Sellers story
- Removed CSS hover on filters
- Fixed size of selection column
- Added scrollTop key to state to enable programatic control of body scrolling
- Added VSCROLL action when the table body is scrolled vertically
- Added icon to distinguish sortable and non-sortable columns
- Fixed crash when attempting to sort in Basic table and Table with autosizing stories
- upgraded dependencies
- Improved log readability in samples

## Version 1.0.3 (2020/05/04)

- Fixed incorrect use of forwardRef
- Migrated to react-infotip@1.0.2
- Rewrote story initialization for people and sellers stories
- Fixed bug when deleting rows in People story
- Added effect to support COLUMN_RESIZING actions triggered outside of the framework
- Fixed resizing of columns not taking into account table position
