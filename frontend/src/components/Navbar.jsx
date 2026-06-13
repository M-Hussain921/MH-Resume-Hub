import { FaSave, FaTrash, FaFilePdf, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import logo from '../assets/workSphere-logo.png'
import '../styles/Navbar.css';

export default function Navbar({ 
  onSave, 
  onDelete, 
  onDownloadPDF, 
  saveStatus, 
  deleteStatus 
}) {
  
  const getSaveButtonContent = () => {
    if (saveStatus === 'saving') {
      return (
        <>
          <FaSpinner className="icon-spinner animation-spin" /> Saving...
        </>
      );
    }
    if (saveStatus === 'success') {
      return (
        <>
          <FaCheckCircle /> Saved!
        </>
      );
    }
    return (
      <>
        <FaSave /> Save
      </>
    );
  };

  const getDeleteButtonContent = () => {
    if (deleteStatus === 'deleting') {
      return (
        <>
          <FaSpinner className="icon-spinner animation-spin" /> Deleting...
        </>
      );
    }
    if (deleteStatus === 'success') {
      return (
        <>
          <FaCheckCircle /> Deleted!
        </>
      );
    }
    return (
      <>
        <FaTrash /> Delete
      </>
    );
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="logo">
          <img src={logo} alt="logo" className="logo-icon" />
          <span className="logo-text">MH ResumeHub</span>
        </div>
        
        <div className="nav-buttons">
          <button 
            className={`nav-btn save-btn ${saveStatus}`} 
            onClick={onSave} 
            disabled={saveStatus === 'saving' || saveStatus === 'success'}
          >
            {getSaveButtonContent()}
          </button>
          
          <button 
            className="nav-btn download-btn" 
            onClick={onDownloadPDF}
          >
            <FaFilePdf /> PDF
          </button>

          <button 
            className={`nav-btn delete-btn ${deleteStatus}`} 
            onClick={onDelete} 
            disabled={deleteStatus === 'deleting'}
          >
            {getDeleteButtonContent()}
          </button>
        </div>
      </div>
    </nav>
  );
}