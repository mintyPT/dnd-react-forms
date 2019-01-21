import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { Form, Text } from "react-form";

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class App extends Component {
  onDragEnd = (result, formApi) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      formApi.values.items,
      result.source.index,
      result.destination.index
    );

    formApi.setValue("items", items);
  };

  render() {
    const defaultValues = {
      items: [
        { content: "delta", id: 1123 },
        { content: "bravo", id: 542 },
        { content: "charlie", id: 4 },
        { content: "echo", id: 1415 },
        { content: "golf", id: 1242 }
      ]
    };

    return (
      <Form defaultValues={defaultValues}>
        {formApi => {
          const { items } = formApi.values;

          return (
            <form onSubmit={formApi.submitForm} id="form1">
              <DND
                onDragEnd={result => this.onDragEnd(result, formApi)}
                items={items}
              />
              <pre>{JSON.stringify(formApi.values, null, 4)}</pre>
            </form>
          );
        }}
      </Form>
    );
  }
}

const DNDFactory = ({ List, Item }) => ({ items, onDragEnd }) => {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <List
            ref={provided.innerRef}
            isDraggingOver={snapshot.isDraggingOver}
          >
            {items.map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided, snapshotItem) => (
                  <div ref={provided.innerRef} {...provided.draggableProps}>
                    <Item
                      dragHandleProps={provided.dragHandleProps}
                      isDragging={snapshotItem.isDragging}
                      isDraggingOver={snapshot.isDraggingOver}
                      {...item}
                    >
                      <Text field={["items", index, "text"]} id="hello" />
                    </Item>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const Item = ({ content, children, dragHandleProps, ...props }) => (
  <ContentWrapper {...props}>
    {children}
    <span {...dragHandleProps}>Drag me baby</span>
  </ContentWrapper>
);

const ContentWrapper = styled.div`
  background: ${props =>
    props.isDragging ? "red" : props.isDraggingOver ? "orange" : "yellow"};
  user-select: none;
  padding: 20px;
  margin: 0 0 10px 0;
`;

const List = styled.div`
  background: ${props => (props.isDraggingOver ? "lightblue" : "lightgrey")};
  padding: 10px;
  width: 250px;
`;

const DND = DNDFactory({ List, Item });

// Put the thing into the DOM!
ReactDOM.render(<App />, document.getElementById("root"));
