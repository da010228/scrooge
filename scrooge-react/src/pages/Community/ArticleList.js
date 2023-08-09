import { useEffect, useState } from "react";
import Article from "./Article";
import styles from "./ArticleList.module.css";

const ArticleList = ({ props }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch("http://day6scrooge.duckdns.org:8081/community")
      .then((resp) => resp.json())
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => console.log(error));
  }, []);
  return (
    <div>
      {data.map((it, index) => (
        <Article key={index} {...it} />
      ))}
    </div>
  );
};

export default ArticleList;
