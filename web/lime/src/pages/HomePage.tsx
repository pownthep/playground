import React, { memo, useState } from "react";
import Stack from "@mui/material/Stack";
import { InputSearch, ListShows } from "@/components";
import IconLime from "@/components/IconLime";
import shows from "@/store/shows.json";
interface Snapshot {
  customRequire: {
    cache: {
      [module: string]: {
        exports: { [module: string]: any };
      };
    };
  };
}

declare global {
  let snapshotResult: Snapshot;
}

export default memo(function HomePage() {
  // const shows: any[] = JSON.parse(
  //   snapshotResult.customRequire.cache["./snapshot.js"].exports["shows"]
  // );
  const [query, setQuery] = useState("");

  return (
    <Stack spacing={1}>
      <InputSearch
        onChange={(q) => setQuery(q)}
        placeholder="Search Lime TV"
        icon={<IconLime />}
        path="/drive"
      />
      <ListShows
        shows={
          shows.filter(({ name }) =>
            name.toLowerCase().includes(query.toLowerCase())
          ) as any
        }
      />
    </Stack>
  );
});
