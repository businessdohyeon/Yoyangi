import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import {
    Card,
    Text,
    Paragraph,
    Avatar,
    Button,
    Chip,
} from 'react-native-paper';

// 간단한 별점 렌더러
function StarRow({ rating = 0 }) {
    const stars = [];
    const full = Math.floor(rating);
    for (let i = 0; i < 5; i++) {
        stars.push(
            <Text key={i} style={styles.star} accessibilityLabel={`star-${i}`}>
                {i < full ? '★' : '☆'}
            </Text>,
        );
    }
    return <View style={styles.starRow}>{stars}</View>;
}

export default function ReviewCard({
    author,
    avatarUri,
    rating,
    date,
    content,
    images,
    tags,
    onPress,
    style,
}) {
    return (
        <Card style={[styles.card, style]} onPress={onPress}>
            <Card.Title
                title={author}
                subtitle={date}
                left={(props) =>
                    avatarUri ? (
                        <Avatar.Image {...props} source={{ uri: avatarUri }} />
                    ) : (
                        <Avatar.Text {...props} label={author[0] || '?'} />
                    )
                }
            />

            <Card.Content>
                <View style={styles.rowBetween}>
                    <StarRow rating={rating} />
                    <Chip compact>
                        {rating ? `${rating.toFixed(1)}` : '평점 없음'}
                    </Chip>
                </View>

                <Paragraph
                    style={styles.content}
                    numberOfLines={4}
                    ellipsizeMode="tail"
                >
                    {content}
                </Paragraph>

                {images && images.length > 0 ? (
                    <View style={styles.imageRow}>
                        {images.slice(0, 3).map((img, idx) => (
                            <TouchableOpacity
                                key={idx}
                                activeOpacity={0.8}
                                onPress={() => {}}
                            >
                                <Image
                                    source={{ uri: img.uri }}
                                    style={styles.imageThumb}
                                />
                            </TouchableOpacity>
                        ))}
                        {images.length > 3 ? (
                            <View style={styles.moreOverlay}>
                                <Text style={styles.moreText}>
                                    +{images.length - 3}
                                </Text>
                            </View>
                        ) : null}
                    </View>
                ) : null}

                {tags && tags.length > 0 ? (
                    <View style={styles.tagsRow}>
                        {tags.map((t, i) => (
                            <Chip key={i} style={styles.tag} compact>
                                {t}
                            </Chip>
                        ))}
                    </View>
                ) : null}
            </Card.Content>

            <Card.Actions>
                <Button onPress={onPress}>자세히</Button>
            </Card.Actions>
        </Card>
    );
}

const styles = StyleSheet.create({
    card: {
        marginVertical: 8,
        marginHorizontal: 12,
        borderRadius: 8,
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    starRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    star: {
        fontSize: 16,
        marginRight: 2,
    },
    content: {
        marginBottom: 8,
    },
    imageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    imageThumb: {
        width: 80,
        height: 80,
        borderRadius: 6,
        marginRight: 8,
        backgroundColor: '#eee',
    },
    moreOverlay: {
        position: 'absolute',
        right: 16,
        top: 40,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    moreText: {
        color: '#fff',
        fontSize: 12,
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    tag: {
        marginRight: 6,
        marginTop: 6,
    },
});

/*
사용 예시

*/
