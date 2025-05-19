import "./Layout.css";
import "./DefaultLayout.css";


export default function Spinner() {
    return (
        <div className="layout-loading">
            <div className="spinner-container">
                <div className="spinner" />
            </div>
        </div>
    );
}
