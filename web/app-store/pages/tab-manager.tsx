import PubSub from "@pownthep/pubsub/lib/es/electron/window";
import { GetStaticProps, NextPage } from "next";
import React from "react";
import { useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  ResponderProvided,
  resetServerContext,
} from "react-beautiful-dnd";
import AddTab from "../components/AddTab";
import Tab from "../components/Tab";

interface TabWindow {
  title: string;
  isActive: boolean;
  id: number;
  favicon: string;
}

const Home: NextPage = () => {
  const [tabs, setTabs] = React.useState<TabWindow[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);

  const reorderTab = (startIndex: number, endIndex: number) => {
    PubSub.publish("/main/tab-service/update/state", { startIndex, endIndex });
  };

  const switchTab = (tabId: number) => {
    PubSub.publish("/main/tab-service/switch", tabId);
  };

  const addTab = () => {
    PubSub.publish("/main/tab-service/add", "https://google.com");
  };

  const closeTab = (tabId: number) =>
    PubSub.publish("/main/tab-service/close", tabId);

  useEffect(() => {
    PubSub.subscribe("/main/tab-service/get/state", (payload: any) => {
      setTabs(payload);
    });
    PubSub.publish("/main/tab-service/get/state", null);
    return () => {};
  }, []);

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (!result.destination) {
      // TODO: Implement new tab window
      console.log("outside");
      return;
    }
    reorderTab(result.source.index, result.destination.index);
    setIsDragging(false);
  };

  const onDragStart = () => setIsDragging(true);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              className="tab-container"
              {...provided.droppableProps}
            >
              {tabs.map(({ favicon, id, isActive, title }, index) => (
                <Draggable key={id} draggableId={String(id)} index={index}>
                  {(provided, snapshot) => (
                    <Tab
                      provided={provided}
                      snapshot={snapshot}
                      onClick={isActive ? () => {} : switchTab}
                      isActive={isActive}
                      title={title}
                      id={id}
                      favicon={favicon}
                      onClose={closeTab}
                    />
                  )}
                </Draggable>
              ))}
              <AddTab
                onClick={addTab}
                isDragging={isDragging}
                className="tab tab-inactive tab-add"
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <AddTab className="tab" isDragging={false} onClick={() => {}} />
    </>
  );
};

// export const getStaticProps: GetStaticProps = async () => {

//   return { props: { data: [] } };
// };

export default Home;
