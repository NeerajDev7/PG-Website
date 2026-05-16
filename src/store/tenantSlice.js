import { createSlice } from "@reduxjs/toolkit";

const ALL_ROOMS = [
  { id: 1, number: "101", type: "Single", price: 25000 },
  { id: 2, number: "102", type: "Single", price: 25000 },
  { id: 3, number: "203", type: "Double", price: 12000 },
  { id: 4, number: "204", type: "Double", price: 12000 },
  { id: 5, number: "305", type: "Triple", price: 9000 },
  { id: 6, number: "510", type: "Double", price: 12000 },
];

const initialState = {
  tenants: [
    { id: 1, name: "Neeraj Kumar", room: "Room 203", rent: 12000, paid: true },
    { id: 2, name: "Hari Krishna", room: "Room 204", rent: 12000, paid: true },
    { id: 3, name: "Rohit", room: "Room 305", rent: 12000, paid: false },
    { id: 4, name: "Aditya", room: "Room 510", rent: 12000, paid: false },
  ],
  rooms: ALL_ROOMS,
};

const tenantsSlice = createSlice({
  name: "tenants",
  initialState,
  reducers: {
    addTenant: (state, action) => {
      state.tenants.push(action.payload);
    },
    markAsPaid: (state, action) => {
      const tenant = state.tenants.find((t) => t.id === action.payload);
      if (tenant) tenant.paid = true;
    },
    removeTenant: (state, action) => {
      state.tenants = state.tenants.filter((t) => t.id !== action.payload);
    },
    resetMonth: (state) => {
      state.tenants.forEach((t) => (t.paid = false));
    },
    addDocument: (state, action) => {
      const tenant = state.tenants.find(
        (t) => t.id === action.payload.tenantId,
      );
      if (tenant) {
        if (!tenant.documents) tenant.documents = [];
        tenant.documents.push({
          name: action.payload.name,
          data: action.payload.data,
          type: action.payload.type,
          uploadedOn: new Date().toLocaleDateString("en-IN"),
        });
      }
    },
    removeDocument: (state, action) => {
      // action.payload = { tenantId, docIndex }
      const tenant = state.tenants.find(
        (t) => t.id === action.payload.tenantId,
      );
      if (tenant) {
        tenant.documents.splice(action.payload.docIndex, 1);
      }
    },
  },
});

export const { addTenant, markAsPaid, removeTenant, resetMonth, addDocument, removeDocument } = tenantsSlice.actions
export default tenantsSlice.reducer;
