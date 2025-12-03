import { useContext, useMemo, useState } from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Button, FAB, useTheme } from 'react-native-paper';

import { ScreenProps } from '../../types/Navigation';
import apis from '../../apis';
import axiosInstance from '../../apis/axios';

import { LocationInfoContext } from '../../Context';

import { FacilityData_t } from '../../types/FacilityDataScheme';
import { FlatList } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import Map from './Map';
import SearchHeader from './SearchHeader';
import SearchResult from './SearchResult';

const LIMIT = 10;
const KIND_DEFAULT_VALUE = ['요양병원', '요양원', '주간보호케어센터'];

export default function SearchPage({
    route,
}: ScreenProps<'SearchPage'>) {
    const theme = useTheme();
    const { locationInfo } = useContext(LocationInfoContext);

    console.group('SearchPage rendered');
    console.log(route.params);
    console.log(route.params?.page);
    console.log(locationInfo);
    console.groupEnd();

    const [isMapShown, setIsMapShown] = useState(false);
    const [kind, setKind] = useState<string[]>(
        route?.params?.kind || KIND_DEFAULT_VALUE,
    );
    const [searchResults, setSearchResults] = useState<FacilityData_t[] | null>(
        null,
    );
    const [refreshing, setRefreshing] = useState(false);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        refetch,
    } = useInfiniteQuery({
        queryKey: [
            'facilities',
            locationInfo?.latitude,
            locationInfo?.longitude,
            kind,
        ],
        queryFn: async ({ pageParam = 1 }) => {
            if (!locationInfo) {
                return [];
            }

            const params = {
                limit: LIMIT,
                page: pageParam,
                latitude: locationInfo.latitude,
                longitude: locationInfo.longitude,
                kind: kind.join(','),
            };

            const response = await axiosInstance.get(apis.urls.facilities, {
                params,
            });
            const { Response } = response.data;

            return Response !== null && Response !== undefined ? Response : [];
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === LIMIT ? allPages.length + 1 : undefined;
        },
        enabled: !!locationInfo && searchResults === null,
        initialPageParam: 1,
        staleTime: 30 * 1000, // 30초 캐싱
    });

    const facilityArray = useMemo(() => {
        return searchResults !== null
            ? searchResults
            : data?.pages.flat() || [];
    }, [searchResults, data]);

    const getMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    // kind 변경시 검색 결과를 리셋하고 쿼리 재요청하는 helper
    const setKindAndReset = (updater: React.SetStateAction<string[]>) => {
        setKind((prev) =>
            typeof updater === 'function'
                ? (updater as Function)(prev)
                : (updater as string[]),
        );
        setSearchResults(null);
        refetch();
    };

    const onRefresh = async () => {
        setRefreshing(true);
        // reset filters and search results
        setSearchResults(null);
        setKindAndReset(KIND_DEFAULT_VALUE);
        setResetCounter((c) => c + 1);
        try {
            await refetch();
        } catch (e) {
            console.warn('refresh refetch failed', e);
        }
        setRefreshing(false);
    };

    return (
        <>
            <SearchHeader
                setSearchResults={setSearchResults}
                kind={kind}
                setKind={setKindAndReset}
            />
            {/* 지도 */}
            <Map isMapShown={isMapShown} facilityArray={facilityArray} />
            {/* 검색결과 목록 */}
            {!isMapShown &&
                (isFetching && facilityArray.length === 0 ? (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <ActivityIndicator
                            animating={true}
                            color={theme.colors.primary}
                        />
                    </View>
                ) : (
                    <FlatList
                        data={facilityArray}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <SearchResult facilityData={item} />
                        )}
                        contentContainerStyle={{
                            padding: 10,
                            backgroundColor: '#eeeeee',
                            gap: 20,
                        }}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        // onEndReached={getMore}
                        // onEndReachedThreshold={0.5}
                        ListFooterComponent={
                            isFetchingNextPage ? (
                                <ActivityIndicator
                                    animating={true}
                                    color={theme.colors.primary}
                                    style={{ marginVertical: 30 }}
                                />
                            ) : hasNextPage ? (
                                <View style={{ marginBottom: 30 }}>
                                    <Button mode="outlined" onPress={getMore}>
                                        더보기
                                    </Button>
                                </View>
                            ) : null
                        }
                    />
                ))}
            <FAB
                icon="map"
                label="지도보기"
                style={{
                    position: 'absolute',
                    margin: 16,
                    right: 0,
                    bottom: 0,
                }}
                onPress={() => {
                    setIsMapShown((cur) => !cur);
                }}
            />
        </>
    );
}
