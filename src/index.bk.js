import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { Form } from "react-form";

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
        { content: "Echo", id: 1415 },
        { content: "golf", id: 1242 }
      ]
    };

    return (
      <Form defaultValues={defaultValues}>
        {formApi => {
          const { items } = formApi.values;

          return (
            <form onSubmit={formApi.submitForm} id="form1">
              <DragDropContext
                onDragEnd={result => this.onDragEnd(result, formApi)}
              >
                <Droppable droppableId="droppable">
                  {(provided, snapshot) => (
                    <ListWrapper
                      ref={provided.innerRef}
                      isDraggingOver={snapshot.isDraggingOver}
                    >
                      {items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <ContentWrapper
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              isDragging={snapshot.isDragging}
                            >
                              {item.content}
                            </ContentWrapper>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ListWrapper>
                  )}
                </Droppable>
              </DragDropContext>
              <pre>{JSON.stringify(formApi.values, null, 4)}</pre>
            </form>
          );
        }}
      </Form>
    );
  }
}

const ContentWrapper = styled.div`
  background: ${props => (props.isDragging ? "red" : "blue")};
  user-select: none;
  padding: 20px;
  margin: 0 0 10px 0;
`;

const ListWrapper = styled.div`
  background: ${props => (props.isDraggingOver ? "lightblue" : "lightgrey")};
  padding: 10px;
  width: 250px;
`;

// Put the thing into the DOM!
ReactDOM.render(<App />, document.getElementById("root"));
