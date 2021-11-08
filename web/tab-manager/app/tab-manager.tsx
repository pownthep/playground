import React from "react";
import ReactDOM from "react-dom";
import "@pownthep/react-web-sdk/css/tab-manager.css";
import "../src/index.css";
import Tab from "@pownthep/react-web-sdk/components/Tab";
import PubSub from "@pownthep/pubsub/lib/es/electron/window";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import AddTab from "@pownthep/react-web-sdk/components/AddTab";
import WinClose from "@pownthep/react-web-sdk/components/BtnWinClose";
import WinMaximize from "@pownthep/react-web-sdk/components/BtnWinMaximize";
import WinMinimize from "@pownthep/react-web-sdk/components/BtnWinMinimize";

interface TabWindow {
  title: string;
  isActive: boolean;
  id: number;
  favicon: string;
}

export function TabManager() {
  const [tabs, setTabs] = React.useState<TabWindow[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isMaximized, setIsMaximized] = React.useState(false);

  const reorderTab = (startIndex: number, endIndex: number) => {
    PubSub.publish("/main/tab-service/update/state", { startIndex, endIndex });
  };

  const switchTab = (tabId: number) => {
    PubSub.publish("/main/tab-service/switch", tabId);
  };

  const addTab = () => {
    PubSub.publish("/main/tab-service/add", "https://google.com");
  };

  const closeTab = (id: number) =>
    PubSub.publish("/main/tab-service/close", id);

  React.useEffect(() => {
    PubSub.subscribe("/main/tab-service/get/state", (payload: any) => {
      setTabs(payload);
    });
    PubSub.publish("/main/tab-service/get/state", null);
    PubSub.subscribe("/main/tab-service/on-maximize", () =>
      setIsMaximized(true)
    );
    PubSub.subscribe("/main/tab-service/on-unmaximize", () =>
      setIsMaximized(false)
    );
    return () => {};
  }, []);

  const minimize = () => PubSub.publish("/main/window/minimize");
  const maximize = () => PubSub.publish("/main/window/toggle-maximize");

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    if (!result.destination) {
      // TODO: Implement new tab window
      console.log("outside");
      return;
    }
    localReorderTab(result.source.index, result.destination.index);
    reorderTab(result.source.index, result.destination.index);
    setIsDragging(false);
  };

  const localReorderTab = (startIndex: number, endIndex: number) => {
    setTabs((oldTabs) => {
      const newState = Array.from(oldTabs);
      const [removed] = newState.splice(startIndex, 1);
      newState.splice(endIndex, 0, removed);
      return newState;
    });
  };

  const onDragStart = () => setIsDragging(true);

  return (
    <>
      <div className="titlebar-win">
        <WinMinimize onClick={minimize} />
        <WinMaximize isMaximized={isMaximized} onClick={maximize} />
        <WinClose onClick={window.parent.close} />
      </div>
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
    </>
  );
}

ReactDOM.render(
  <React.StrictMode>
    <TabManager />
  </React.StrictMode>,
  document.getElementById("root")
);
