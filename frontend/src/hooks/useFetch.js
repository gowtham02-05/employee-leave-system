import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

function useFetch(url, options = {}) {
  const {
    enabled = true,
    method = 'get',
    data = null,
    config = {},
  } = options;

  const [dataState, setDataState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!url) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        url,
        method,
        data,
        ...config,
      });

      setDataState(response.data);
      return response.data;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Something went wrong',
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, [url, method, data, config]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  return {
    data: dataState,
    loading,
    error,
    refetch: fetchData,
  };
}

export default useFetch;