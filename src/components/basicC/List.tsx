import React from "react";
import { FlatList } from "react-native";
import OwnView from "./View";
import styled from "styled-components/native";

const Header = styled(props => {
return(<OwnView {...props}/>)})`
    border-width: 0.7
` 
const ItemSperator = styled(props => <OwnView {...props}/>)`
    border-width: 0.4;
    margin-left: 5;
    margin-right: 5;
`
const Footer = styled(props => <OwnView {...props}/>)`
    border-width: 0.7
` 

const _keyExtractor = (item, i) => i.toString()
const _header = () => <Header/>
const _itemSperator = () => <ItemSperator/>
const _footer = () => <Footer/>

const OwnList = ({ data, extraData, refreshing, renderItem, style={} }) => {
    return (
        <FlatList
            style={style}
            data={data}
            extraData={extraData}
            keyExtractor={_keyExtractor}
            renderItem={renderItem}
            refreshing={refreshing}
            ListHeaderComponent={_header}
            ItemSeparatorComponent={_itemSperator}
            ListFooterComponent={_footer}
        />
    )
}

export default OwnList;