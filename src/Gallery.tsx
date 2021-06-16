import React, { useEffect, useState } from 'react'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { connect } from 'react-redux'
import { fetchPast, fetchStarship } from './redux'
import { Image, Pagination } from 'antd';
import moment, { Moment } from 'moment';
function Gallery({ pastData, fetchPast,starshipData, fetchStarship }) {
    const paginationStyle = { paddingBottom: "24px", textAlign: "center" as const }
    const [minValue, setMinValue] = useState<number>(0);
    const [maxValue, setMaxValue] = useState<number>(50);
    const [pageSize, setPageSize] = useState<number>(50)
    const [imageSize, setImageSize] = useState<number>(0);
    const [images, setImages] = useState<any>([]);

    function handleChange(value, pageSize) {
        setPageSize(pageSize)
        if (value <= 1) {
            setMinValue(0)
            setMaxValue(pageSize)
        } else {
            setMinValue((value - 1) * pageSize)
            setMaxValue(value * pageSize)
        }
    }
    useEffect(() => {
        fetchPast();
        fetchStarship();
    }, [])

    useEffect(() => {
        let array = [] as Array<any>[]
        for (let i in pastData.past) {
            for (let j in pastData.past[i]['links']['flickr']['original']) {
                array.push([pastData.past[i]['links']['flickr']['original'][j],pastData.past[i]["date_utc"]])
            }
        }       
        for (let i in starshipData.starship.previous) {
                array.push([starshipData.starship.previous[i]['image'] , starshipData.starship.previous[i]["net"]])
        }
        array.sort((a,b) => 
            moment(b[1]).valueOf() - moment(a[1]).valueOf())
        console.log(array)
        setImages(array)
        setImageSize(array.length)
    }, [pastData.loading, starshipData.loading])
    return (
        <>
            <Pagination
                style={paginationStyle}
                defaultCurrent={1}
                onChange={handleChange}
                pageSize={pageSize}
                total={imageSize}
                responsive={true}
                pageSizeOptions={["50", "100", "150", "200"]}
            />
            <ResponsiveMasonry
                columnsCountBreakPoints={{ 350: 1, 700: 2, 1100: 5 }}
            >
                <Masonry gutter={16}>
                    {images.slice(minValue, maxValue).map((data) => (
                        <Image src={data[0]} style={{ objectFit: "contain" }} key={data} />

                    ))}
                </Masonry>
            </ResponsiveMasonry>
        </>
    )
}

const mapStateToProps = state => {
    return {
        pastData: state.past,
        starshipData: state.starship
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPast: () => dispatch(fetchPast()),
        fetchStarship: () => dispatch(fetchStarship())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Gallery)