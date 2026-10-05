import pages from './portal-content.json';
import './portal.css';
// Static, repository-owned markup; never accepts account or remote content.
export default function PublicPortal({page}:{page:keyof typeof pages}) { return <div className="rma-portal" dangerouslySetInnerHTML={{__html:pages[page]}} />; }
