import { createSlice } from "@reduxjs/toolkit";

interface Props {
  isOpen: boolean;
  isMobileOrTablet: boolean;
}

const initialState: Props = {
  isOpen: true,
  isMobileOrTablet: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
    setIsMobileOrTablet: (state, action) => {
      state.isMobileOrTablet = action.payload;
    },
  },
});

export const { toggleSidebar, setIsMobileOrTablet } = sidebarSlice.actions;
export default sidebarSlice.reducer;
