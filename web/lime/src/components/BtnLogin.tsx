import React, { memo } from 'react';
import { Divider, ListItem, ListItemText } from '@mui/material';

function LoginBtn() {
  return (
    <>
      <ListItem
        button
        onClick={() => {}}
        // style={{
        //   width: 'auto',
        //   marginTop: 25,
        //   marginRight: 5,
        //   marginLeft: 5,
        //   border: 0,
        //   borderRadius: 4,
        //   marginBottom: 5
        // }}
      >
        <ListItemText primary={'Login'} />
      </ListItem>
      <Divider style={{ margin: 10 }} />
    </>
  );
}

export default memo(LoginBtn);
