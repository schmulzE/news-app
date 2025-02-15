// SearchPage.js
import React, { useState } from "react";
import { View, TextInput, FlatList, StyleSheet, ActivityIndicator, Text } from "react-native";
import axios from "axios";

const Search = () => {
  const [query, setQuery] = useState("");
  interface NewsItem {
    uuid: string;
    title: string;
    description: string;
  }
  
  const [results, setResults] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length > 2) { // Only search if the query has more than 2 characters
      setLoading(true);
      try {
        const params = {
          api_token: "s3aTHc7el1qTrLnPdexPVPkaWIoBjiqgN3mGyiEG",
          categories: "general,business,tech", // Add more categories if needed
          search: text,
          limit: "50",
        };

        const esc = encodeURIComponent;
        const queryString = Object.keys(params)
          .map((k) => esc(k) + "=" + esc(params[k as keyof typeof params]))
          .join("&");

        const response = await axios.get(
          `https://api.thenewsapi.com/v1/news/all?${queryString}`
        );

        setResults(response.data.data); // Assuming the API returns data in `data` field
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]); // Clear results if the query is too short
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search news..."
        value={query}
        onChangeText={handleSearch}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={results}
          renderItem={({ item }) => (
            <View style={styles.resultItem}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          )}
          keyExtractor={(item) => item.uuid}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  resultItem: { marginBottom: 20 },
  title: { fontSize: 18, fontWeight: "bold" },
  description: { fontSize: 14, color: "gray" },
});

export default Search;