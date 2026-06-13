import { toast } from "react-toastify";

export const confirmDeleteToast = (onConfirm) => {
  toast(
    ({ closeToast }) => (
      <div>
        <p>Are you sure you want to delete?</p>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button
            onClick={() => {
              onConfirm();   
              closeToast(); 
            }}
            style={{
              background: "#dc2626",
              color: "#fff",
              border: "none",
              padding: "6px 10px",
              cursor: "pointer"
            }}
          >
            Yes
          </button>

          <button
            onClick={closeToast}
            style={{
              background: "#e5e7eb",
              border: "none",
              padding: "6px 10px",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
    }
  );
};