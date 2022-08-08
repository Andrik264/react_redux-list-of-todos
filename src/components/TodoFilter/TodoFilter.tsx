import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import debounce from 'lodash.debounce';

import { actions as todosActions } from '../../store/todos';

import { Filter } from '../../types/Filter';
import { QueryParams } from '../../types/queryParams';

export const TodoFilter = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState({
    status: searchParams.get('status') || '',
    title: searchParams.get('title') || '',
  });

  const getFilters = (newQueryParams: { status: string; title: string; }) => {
    const { status, title } = newQueryParams;

    return {
      status,
      title,
    };
  };

  const applySearchParams = useCallback((newQuery: QueryParams) => {
    Object.entries(newQuery).forEach(([query, value]) => {
      if (!value) {
        searchParams.delete(query);
      } else {
        searchParams.set(query, value);
      }
    });

    setSearchParams(searchParams);
  }, [pathname]);

  const applyQueryWithDebounce = useCallback(
    debounce((newFilters) => {
      applySearchParams(newFilters);
      dispatch(todosActions.filterBy(newFilters));
    },
    500),
    [pathname],
  );

  const handleFilter = (
    filterBy: keyof Filter,
    value: string,
  ) => {
    const newQuery = {
      ...queryParams,
      [filterBy]: value,
    };
    const newFilters: Filter = getFilters(newQuery);

    setQueryParams({ ...newQuery });

    if (filterBy === 'title') {
      applyQueryWithDebounce(newFilters);
    } else {
      applySearchParams(newFilters);
      dispatch(todosActions.filterBy(newFilters));
    }
  };

  return (
    <form className="field has-addons">
      <p className="control">
        <span className="select">
          <select
            data-cy="statusSelect"
            value={queryParams.status}
            onChange={event => handleFilter('status', event.target.value)}
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </span>
      </p>

      <p className="control is-expanded has-icons-left has-icons-right">
        <input
          data-cy="searchInput"
          type="text"
          className="input"
          placeholder="Search..."
          value={queryParams.title}
          onChange={event => handleFilter('title', event.target.value)}
        />
        <span className="icon is-left">
          <i className="fas fa-magnifying-glass" />
        </span>

        <span className="icon is-right" style={{ pointerEvents: 'all' }}>
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button
            data-cy="clearSearchButton"
            type="button"
            className="delete"
            onClick={() => handleFilter('title', '')}
          />
        </span>
      </p>
    </form>
  );
};
