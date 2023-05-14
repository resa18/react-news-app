import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import axios from "axios";
import { makeStyles } from "@material-ui/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Moment from "moment";
import Masonry from "react-masonry-css";
import Pagination from "./components/Pagination";
let PageSize = 10;
function Dashboard() {
  const classes = useStyles();
  const [user, setUser] = useState({});
  const [newsSource, setSource] = useState("");
  const [date, setDate] = useState(new Date());
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  //   const [nPages, setnPage] = useState(0);
  const [totalData, setTotalData] = useState(0);

  const history = useHistory();

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios.get("http://localhost:8000/api/user").then((response) => {
      setUser(response.data);
    });
  };
  const handleCalendarClose = () => console.log("Calendar closed");
  const handleCalendarOpen = () => console.log("Calendar opened");

  const FilterArticles = async (e) => {
    e.preventDefault();
    getArticle(page);
  };

  const getArticle = async (pages) => {
    const formData = new FormData();

    formData.append("source", newsSource);
    formData.append("date", Moment(date).format("YYYY-MM-DD"));
    formData.append("category", category);
    formData.append("page", pages);

    await axios
      .post("http://localhost:8000/api/getarticles", formData)
      .then((response) => {
        setData(response.data.data);
        setTotalData(response.data.total);
      })
      .catch((error) => {
        // setValidation(error.response.data);
      });
  };

  const PageChanges = (page) => {
    setPage(page);
    getArticle(page);
  };
  const breakpointColumns = {
    default: 3,
    1000: 2,
    500: 1,
  };

  useEffect(() => {
    if (!token) {
      history.push("/");
    }

    fetchData();
  }, []);

  const logoutHanlder = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios.post("http://localhost:8000/api/logout").then(() => {
      localStorage.removeItem("token");

      history.push("/");
    });
  };
  return (
    <div className="container" style={{ marginTop: "50px" }}>
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="card border-0 rounded shadow-sm">
            <div className="card-body">
              WELCOME <strong className="text-uppercase">{user.name}</strong>
              <button
                onClick={logoutHanlder}
                className="btn btn-md btn-danger float-end"
              >
                LOGOUT
              </button>
              <hr />
              <form onSubmit={FilterArticles}>
                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Source</label>
                      {/* <input
                        className="form-control"
                        value={newsSource}
                        onChange={(e) => setSource(e.target.value)}
                        placeholder="Source"
                      /> */}
                      <select
                        class="form-select"
                        aria-label="Select Source"
                        value={newsSource}
                        onChange={(e) => setSource(e.target.value)}
                        required={true}
                      >
                        <option value=""></option>
                        <option value="guardian">The Guardian</option>
                        <option value="tnt">The New York Times</option>
                        <option value="newsapi">News Api</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Date</label>
                      {/* <input
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        placeholder="Date"
                      /> */}
                      <DatePicker
                        className={classes.datePicker}
                        dateFormat="dd/MM/yyyy"
                        // label="Date"
                        // // autoOk={true}
                        // // disableFuture={true}
                        // value={date}
                        // onChange={(date) => setDate(date)}
                        // KeyboardButtonProps={{
                        //   "aria-label": "change date",
                        // }}
                        selected={date}
                        onChange={(date) => setDate(date)}
                        onCalendarClose={handleCalendarClose}
                        onCalendarOpen={handleCalendarOpen}
                      />
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">Category</label>
                      <input
                        className="form-control"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="Category"
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <button type="submit" className="btn btn-primary float-end">
                      Search
                    </button>
                  </div>
                </div>
              </form>
              <div>
                {data.length > 0 ? (
                  <>
                    <table className="table">
                      <thead>
                        <tr></tr>
                      </thead>
                      <tbody>
                        {data.map((item) => (
                          <tr>
                            <td>
                              {newsSource == "guardian" && (
                                <>
                                  {item.webTitle}{" "}
                                  <a href={item.webUrl} target="_blank">
                                    Read More...
                                  </a>
                                </>
                              )}

                              {newsSource == "tnt" && (
                                <>
                                  {item.snippet}{" "}
                                  <a href={item.web_url} target="_blank">
                                    Read More...
                                  </a>
                                </>
                              )}

                              {newsSource == "newsapi" && (
                                <>
                                  {item.title}{" "}
                                  <a href={item.url} target="_blank">
                                    Read More...
                                  </a>
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className={classes.pagination}>
                      <Pagination
                        className="pagination-bar"
                        currentPage={page}
                        totalCount={totalData}
                        pageSize={PageSize}
                        onPageChange={(page) => PageChanges(page)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="mt-10 text-2xl">Article Not Found!</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const useStyles = makeStyles((theme) => ({
  datePicker: {
    width: "100%",
    height: "38px",
    bordercolor: "lightgrey",
  },
  pagination: {
    float: "right",
  },
}));
export default Dashboard;
