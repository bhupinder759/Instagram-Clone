import { creatSLice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState:{
        onlineUsers: []
    },
    reducers: {
        setOnlineUserss:(state,action) => {
            state.socket = action.payload;
        }
    }
});
export const { setOnlineUsers } = chatSlice.actions;
export default chatSlice.reducer;