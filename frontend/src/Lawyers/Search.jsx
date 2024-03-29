import React, { useState, useEffect, useMemo } from "react";
import Axios from "axios";
import Scrollbar from "react-scrollbars-custom";
// import { ListGroup, ListGroupItem } from "reactstrap";

import {
  Row,
  Col,
  Input,
  Button,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";

import Trie from "./Trie.jsx";
import specialization from "./Specialization";
import { Link } from "react-router-dom";

const Search = () => {
  const [text, setText] = useState();
  const [suggestions, setSuggestions] = useState([]);

  const memoized_trie = useMemo(() => {
    const trie = new Trie();

    // Insert
    for (let i = 0; i < specialization.length; i++) {
      trie.insert(specialization[i]);
    }

    return trie;
  }, []);

  function onTextChanged(e) {
    let value = e.target.value;
    setText(value);
    fetchLawyer();
    value = value.toLowerCase();
    if (value !== "") setSuggestions(memoized_trie.find(value));
    else setSuggestions([]);
  }

  function suggestionSelected(value) {
    setText(value);
    setSuggestions([]);
  }

  function renderSuggestions() {
    if (suggestions.length === 0) {
      return null;
    }
    return (
      <InputGroup>
        <ul className="list-group dropdown-menu pt-0 pb-0">
          {suggestions.map((item) => (
            <li
              className="list-group-item list-group-item-action"
              onClick={() => suggestionSelected(item)}
              key={item}
            >
              {item} 
            </li>
          ))}
        </ul>
      </InputGroup>
    );
  }

  const [Lawyer, setLawyer] = useState([]);

  const fetchLawyer = async () => {
    const { data } = await Axios.get(
      `${process.env.REACT_APP_SERVER_URL}/lawyers/`
    );
    setLawyer(data);
    console.log(data);
  };

  const UpdateDisplay = (text) => {
    setLawyer((Lawyer) => {
      return Lawyer.filter(
        (lawyer) => lawyer.specialization.toLowerCase() === text.toLowerCase()
      );
    });
    console.log(Lawyer);
  };

  useEffect(() => {
    fetchLawyer();
  }, []);

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <InputGroup>
            <Input
              value={text}
              type="text"
              placeholder="Search Your Lawyer"
              onChange={onTextChanged}
              className="mb-1"
            />
            <div style={{ height: 10 }} className="">
              <InputGroupAddon addonType="append">
                <Button
                  className="h-10 d-inline-block"
                  color="primary"
                  onClick={() => UpdateDisplay(text)}
                >
                  Search Lawyer
                </Button>
              </InputGroupAddon>
            </div>
          </InputGroup>
          {renderSuggestions()}
        </Col>
      </Row>

      {/* <ListGroup> */}
      <Scrollbar
        noScrollX
        style={{ position: "", height: "64vh", width: "144vh" }}
        className="col-12 col-md-12"
      >
        <div className="row">
          {Lawyer.map((doc) => (
            // <ListGroupItem key={doc.id} className="mb-3">
            <div className="col-sm-6 mb-2" key={doc._id}>
              <div className="card">
                <div className="card-body">
                  <div className="text-info">
                    <h6>
                      Lawyer Name:
                      <span className="text-uppercase"> {doc.name}</span>
                    </h6>
                  </div>
                  <div>Specialization : {doc.specialization}</div>
                  <div>Phone Number : {doc.phoneNumber}</div>
                  <div className="row mb-0 pb-0">
                    <div className="col-md-6 ">
                      FeesPerSession: {doc.feesPerSession}
                    </div>
                    <div
                      className=" col align-self-end col-md-2 offset-md-3 inline"
                      style={{ textAlign: "center" }}
                    ><Link to={{ pathname: "/prisoner/selectdate", lawyer: { lawyer: doc } }}>
                      <button className="btn btn-sm btn-primary"
                     
                      >  Book</button> </Link>
                    </div>
                  </div>

                  {/* </ListGroupItem> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Scrollbar>
      {/* </ListGroup> */}
    </div>
  );
};

export default Search;