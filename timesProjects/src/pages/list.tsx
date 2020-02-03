import { NextPage } from 'next';
import Link from 'next/link';
import BasicLayout from '../components/BasicLayout';
import fetch from 'isomorphic-unfetch';
import useSWR from 'swr';
import { fetcher, defaultOption } from '../utils/fetcher';
import { Table, TableHead, TableRow, TableCell, Checkbox, TableSortLabel, TableContainer, TableBody, Card, Avatar, Grid } from '@material-ui/core';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import moment from 'moment';
import constants from '../utils/constants';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

interface Props {
  userAgent?: string
}

type Order = 'asc' | 'desc';

interface Data {
  projectName: string;
  raisedAmount: number;
  receiverName: number;
  targetAmount: string;
  createdAt: Date;
  expiredAt: Date;
}

function desc<T>(a: T, b: T, orderBy: keyof T) {
  if (a[orderBy] > b[orderBy]) {
    return -1;
  } else if (a[orderBy] < b[orderBy]) {
    return 1;
  } else {
    return 0;
  }
}

function getSorting<K extends keyof any>(
  order: Order,
  orderBy: K,
): (a: { [key in K]: number | string }, b: { [key in K]: number | string }) => number {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'projectName', numeric: false, disablePadding: true, label: 'Project Name' },
  { id: 'receiverName', numeric: false, disablePadding: false, label: 'Receiver' },
  { id: 'raisedAmount', numeric: true, disablePadding: false, label: 'Raised' },
  { id: 'targetAmount', numeric: true, disablePadding: false, label: 'Target' },
  { id: 'createdAt', numeric: false, disablePadding: false, label: 'Created At' },
  { id: 'expiredAt', numeric: false, disablePadding: false, label: 'Expired At' },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'center' : 'right'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const Page: NextPage<Props> = (props: Props) => {
  const { data, error } = useSWR('/api/projects', url => fetcher(url, {
    ...defaultOption
  }));
  console.log("data", data);
  return (
    <BasicLayout key="list">
      <TableContainer component={Card}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell align="left">Receiver</TableCell>
              <TableCell align="center">Raised</TableCell>
              <TableCell align="center">Target</TableCell>
              <TableCell align="left">Created At</TableCell>
              <TableCell align="left">Expired At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(data && data.content)
              ? data.content.map(row => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    <Link href={`/${row._id}`}>
                      <Grid container justify="flex-start">
                        <Grid item>
                          <Avatar src={row.projectImageURL} alt={row.projectName} />
                        </Grid>
                        <Grid item>
                          {row.projectName}
                        </Grid>
                      </Grid>
                    </Link>
                  </TableCell>
                  <TableCell align="left">{row.receiverName}</TableCell>
                  <TableCell align="center">{row.raisedAmount}</TableCell>
                  <TableCell align="center">{row.targetAmount}</TableCell>
                  <TableCell align="left">{moment(row.createdAt).format(constants["dateFormat"])}</TableCell>
                  <TableCell align="left">{moment(row.expiredAt).format(constants["dateFormat"])}</TableCell>
                </TableRow>
              ))
              : null
            }
          </TableBody>
        </Table>
      </TableContainer>
    </BasicLayout>
  )
}

Page.getInitialProps = async ({ req }) => {
  const userAgent = req ? req.headers['user-agent'] : navigator.userAgent
  return { userAgent }
}

export default Page;
