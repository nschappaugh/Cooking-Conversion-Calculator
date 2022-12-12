/* <!-- Nicolas Schappaugh 12-12-2022 --> */

import Converter from '../../containers/Converter'
import './app.css';

// This is the app, it is very simple. I decided to place the main functions of the app in the converter component instead of here in case there is something else I want to add.
function App() {
  return (
    <div className="App">
      <Converter />
    </div>
  );
}

export default App;
