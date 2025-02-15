// BookmarkPage.js
import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

const BookmarkPage = () => {
  const [bookmarks, setBookmarks] = useState([]); // Add logic to manage bookmarks

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        renderItem={({ item }) => (
          <View style={styles.bookmarkItem}>
            <Text style={styles.title}>{item.title}</Text>
          </View>
        )}
        keyExtractor={(item) => item.uuid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  bookmarkItem: { marginBottom: 10 },
  title: { fontSize: 16 },
});

export default BookmarkPage;