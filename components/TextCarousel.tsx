import React from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';

interface TextCarouselProps {
  items: string[];
  selectedItem: string;
  onSelectItem: (item: string) => void;
}

const TextCarousel: React.FC<TextCarouselProps> = ({ items, selectedItem, onSelectItem }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onSelectItem(item)}
          style={[
            styles.tag,
            selectedItem === item && styles.selectedTag
          ]}
        >
          <Text style={[
            styles.tagText,
            selectedItem === item && styles.selectedTagText
          ]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedTag: {
    backgroundColor: '#007AFF',
  },
  tagText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTagText: {
    color: '#fff',
  },
});

export default TextCarousel;