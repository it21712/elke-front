import React, { useState, useEffect } from "react";
import '../css/FadeInList.css';

const FadeInList = ({ tWrapperStyle, items }) => {

    const [visibleItems, setVisibleItems] = useState([items[0]]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setVisibleItems(prevVisibleItems => {
                const nextItem = items[prevVisibleItems.length];
                return [...prevVisibleItems, nextItem];
            });
        }, 200);

        return () => clearInterval(intervalId);
    }, [items]);

    return (
        <div className={tWrapperStyle}>
            {visibleItems.map((item, index) => (
                <div key={index} className={`opacity-0 animate-fade-in w-full h-full`}>
                    {item}
                </div>
            ))}
        </div>
    );
};

export const FadeInListNest = ({ children, tWrapperStyle }) => {

    const [visibleItems, setVisibleItems] = useState([children[0]]);
    console.log(visibleItems);



    useEffect(() => {
        const intervalId = setInterval(() => {
            if (visibleItems.length <= children.length)
                setVisibleItems(prevVisibleItems => {
                    const nextItem = children[prevVisibleItems.length];
                    return [...prevVisibleItems, nextItem];
                });
        }, 100);

        return () => clearInterval(intervalId);
    }, [visibleItems.length]);

    return (
        <div className={tWrapperStyle}>
            {visibleItems.map((item, index) => (
                <div key={index} className={`opacity-0 animate-fade-in w-full`}>
                    {item}
                </div>
            ))}
        </div>
    );
};

export default FadeInList;

