import React, { useEffect, useState } from 'react'
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry"
import PropTypes from 'prop-types'
import { Image, Pagination} from 'antd';
function Gallery({value}) {
    const paginationStyle = { paddingBottom: "24px", textAlign: "center" as const }
    const [items, setItems] = useState<any>([]);
    const [minValue, setMinValue] = useState<number>(0);
    const [maxValue, setMaxValue] = useState<number>(50);
    const [pageSize, setPageSize] = useState<number>(50)
    const [imageSize, setImageSize] = useState<number>(0);
    const [images, setImages] = useState<any>([]);
    Promise.resolve(value).then((result) => {
        setItems(result.sort(comp))
    })
    function comp(a: { date_unix: string | number | Date; }, b: { date_unix: string | number | Date; }) {
        return new Date(b.date_unix).getTime() - new Date(a.date_unix).getTime();
    }

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
        let array = [] as any
        let value = 0;
        for(let i in items) {
            for(let j in items[i]['links']['flickr']['original']){
                array[value] = items[i]['links']['flickr']['original'][j]
               value++;
            }
        }
        setImages(array)
        setImageSize(array.length)
    }, [items])
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
                columnsCountBreakPoints={{350: 1, 700: 2, 1100: 5}}
                 >
                <Masonry gutter={15}>
                                {images.slice(minValue, maxValue).map((data) => (
                                        <Image src={data} style={{ objectFit: "contain" }} />

                                ))}
                                    </Masonry>
            </ResponsiveMasonry>
</>
    )
}

Gallery.propTypes = {
    value: PropTypes.object,

}
export default Gallery
