
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { Logger } from '../../utils/logger';

export const LogViewer = () => {
  const [visible, setVisible] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = Logger.subscribe(() => {
      setLogs([...Logger.getLogs()]);
    });
    return unsubscribe;
  }, []);

  if (!visible) {
    return (
      <TouchableOpacity style={styles.floatingButton} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>🐛 Logs</Text>
      </TouchableOpacity>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>App Logs</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => Logger.clear()}>
              <Text style={styles.actionText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
        <FlatList
          data={logs}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.logItem}>
              <Text style={[
                styles.logText,
                item.startsWith('[ERROR]') ? styles.errorText :
                item.startsWith('[WARN]') ? styles.warnText : styles.infoText
              ]}>
                {item}
              </Text>
            </View>
          )}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 20,
    zIndex: 9999,
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    alignItems: 'center',
  },
  title: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  actions: { flexDirection: 'row', gap: 10 },
  actionButton: { padding: 8, backgroundColor: '#444', borderRadius: 5 },
  actionText: { color: 'white' },
  closeButton: { padding: 8, backgroundColor: '#d32f2f', borderRadius: 5 },
  closeText: { color: 'white' },
  logItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  logText: { fontSize: 12, fontFamily: 'monospace' },
  infoText: { color: '#a5d6a7' },
  warnText: { color: '#fff59d' },
  errorText: { color: '#ef9a9a' },
});
