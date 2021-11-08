import React, { memo, useState } from "react";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { Show } from "../interface";
import ShowPageHeader from "./ShowHeader";
import ListEpisodes from "./ListEpisodes";

interface Props {
  open: boolean;
  onClose: () => void;
  show: Show | undefined;
  setEpisode: Function;
}

const Transition = React.forwardRef(function Transition(
  props: any,
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default memo(function DialogShow({
  open,
  onClose,
  show,
  setEpisode,
}: Props) {
  const [query, setQuery] = useState("");
  const handleClose = () => {
    onClose();
    setQuery("");
  };

  return (
    <Dialog
      maxWidth="sm"
      fullWidth={true}
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      sx={{
        paddingTop: "60px",
        paddingBottom: "120px",
        boxSizing: "border-box",
      }}
    >
      {show && (
        <>
          <ShowPageHeader
            banner={show.banner}
            poster={show.poster}
            showTitle={show.name}
            imdb={show.imdb}
            type={show.type}
            onClose={handleClose}
            onChange={setQuery}
          />
          <ListEpisodes
            episodes={show.episodes.filter(
              (e) =>
                e.size && e.name.toLowerCase().includes(query.toLowerCase())
            )}
            showTitle={show.name}
            setEpisode={setEpisode}
          />
        </>
      )}
    </Dialog>
  );
});
