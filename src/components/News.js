import React, { useState,useEffect } from "react";
import NewsItems from "./NewsItems";
import Spinner from "./Spinner";
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";


const News =(props)=> {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0)
 
  const capitalizeFirstLetter = (string)=> {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const updateNews =async ()=> {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true)
    let data = await fetch(url)
    let parsedData = await data.json()
    console.log(parsedData);
    setArticles( parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)
    props.setProgress(100);
  }

useEffect(() => {
    document.title=`${capitalizeFirstLetter(props.category)} - DailyNews`
    updateNews()
  }, [])
  
 

 const handleprevClick = async () => {
  setPage(page-1)
    updateNews();
  }

 const handlenextClick = async () => {
    
  setPage(page+1)
    updateNews();
  }
 const fetchMoreData = async() => {
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=08e1d37008984d0bb65dabf06df97054&page=${page+1}&pageSize=${props.pageSize}`;
    setPage(page+1)
    let data = await fetch(url)
    let parsedData = await data.json()
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)
  };
 
    return (
      <>
        <h1 className="text-center" style={{ margin: '30px 0px' ,marginTop:'90px' }}>DailyNews-Top {capitalizeFirstLetter(props.category)} Headlines</h1>
        {/* {loading && <Spinner />} */}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}
        >
        <div className="container">
        <div className="row">
          {!loading && articles.map((element) => {
            return <div className="col-md-4" key={element.url}>
              <NewsItems title={element.title ? element.title : ""} description={element.description ? element.description : ""}
                imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
            </div>
          })}
        </div>
        </div>
        </InfiniteScroll>
     
      </>
    );
  
}

News.defaultProps = {
  pageSize: 5,
  country: "in",
  category: "general"
}

News.propTypes = {
  pageSize: PropTypes.number,
  country: PropTypes.string,
  category: PropTypes.string
}

export default News;
