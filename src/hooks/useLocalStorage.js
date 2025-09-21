const useLocalStorage = (key) => {
    const stringData = localStorage.getItem(key);
    if (!stringData) return null;

    const jsonData = JSON.parse(stringData);
    return { ...jsonData };
};

export default useLocalStorage;
