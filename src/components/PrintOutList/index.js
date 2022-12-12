/* <!-- Nicolas Schappaugh 12-12-2022 --> */

import React from "react";

import "./printOutList.css";

class PrintOutList extends React.Component {

  render() {
    const printList = this.props.data.map((item, i) =>
      <li key={i}>
        {item}
      </li>
    );

      return (
        <div className="printOutList">
          <ul>
            {printList}
          </ul>
        </div>
      );
  };
};

export default PrintOutList;
