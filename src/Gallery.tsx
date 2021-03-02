import React, { useEffect, useState } from 'react'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { connect } from 'react-redux'
import { fetchPast } from './redux'
import { Image, Pagination } from 'antd';
function Gallery({ pastData, fetchPast }) {
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
    }, [])

    useEffect(() => {
        let array = [] as any
        let value = 0;
        for (let i in pastData.past) {
            console.log(pastData.past)
            for (let j in pastData.past[i]['links']['flickr']['original']) {
                array[value] = pastData.past[i]['links']['flickr']['original'][j]
                value++;
            }
        }
        setImages(array)
        setImageSize(array.length)
    }, [pastData.loading])
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
                        <Image src={data} style={{ objectFit: "contain" }} key={data} />

                    ))}
                </Masonry>
            </ResponsiveMasonry>
        </>
    )
}

const mapStateToProps = state => {
    return {
        pastData: state.past
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPast: () => dispatch(fetchPast()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Gallery)