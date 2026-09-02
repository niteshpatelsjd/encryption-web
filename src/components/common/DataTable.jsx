import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
  Typography,
  Skeleton,
} from '@mui/material'

function SkeletonRows({
  columns,
  count = 6,
}) {
  return Array.from({
    length: count,
  }).map((_, i) => (
    <TableRow key={i}>
      {columns.map((col) => (
        <TableCell
          key={col.key}
          sx={{
            borderColor: '#E5E7EB',
            py: 1.5,
          }}
        >
          <Skeleton
            variant="rounded"
            height={14}
            width={
              col.key === 'actions'
                ? 60
                : col.key ===
                  'profileUrl'
                ? 28
                : '80%'
            }
            sx={{
              bgcolor: '#E5E7EB',
              '&::after': {
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
              },
            }}
          />
        </TableCell>
      ))}
    </TableRow>
  ))
}

export default function DataTable({
  columns,
  rows,
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
  loading,
  maxHeight,
  disableScroll = false,
  disableVerticalScroll = false,
  emptyText = 'No records found',
}) {
  return (
    <Box
  sx={{
    width: '100%',
    maxWidth: '100%',
    border: '1px solid #E5E7EB',
    borderRadius: 3,
    bgcolor: '#FFFFFF',
    position: 'relative',
    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
    overflow: 'hidden',
  }}
>
      {/* Top progress bar */}
      {loading && (
        <Box
          sx={{
            position:
              'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            zIndex: 10,
            overflow:
              'hidden',
            bgcolor:
              'transparent',
          }}
        >
          <Box
            sx={{
              height: '100%',
              bgcolor:
                '#111827',
              animation:
                'slideProgress 1.2s ease-in-out infinite',

              '@keyframes slideProgress':
                {
                  '0%': {
                    transform:
                      'translateX(-100%)',
                  },
                  '100%': {
                    transform:
                      'translateX(100%)',
                  },
                },
            }}
          />
        </Box>
      )}

      <TableContainer
  sx={{
    width: '100%',
    overflowX: disableScroll ? 'hidden' : 'auto',
    overflowY: disableScroll || disableVerticalScroll
      ? 'hidden'
      : maxHeight
        ? 'auto'
        : 'hidden',
    maxHeight: disableScroll || disableVerticalScroll
      ? 'none'
      : maxHeight || 'none',

    '&::-webkit-scrollbar': {
      width: 8,
      height: 8,
    },

    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(17,24,39,0.28)',
      borderRadius: 10,
    },
  }}
>
    <Table
  size="small"
  stickyHeader={Boolean(maxHeight) && !disableScroll && !disableVerticalScroll}
  sx={{
    minWidth: disableScroll ? '100%' : 'max-content',
    tableLayout: disableScroll ? 'fixed' : 'auto',
  }}
>
          <TableHead>
            <TableRow
              sx={{
                bgcolor:
                  '#F9FAFB',
                  
              }}
            >
              {columns.map(
                (col) => (
                  <TableCell
                    key={
                      col.key
                    }
                    sx={{
                      width: col.width,
                      maxWidth: col.width,
                      borderColor:
                        '#E5E7EB',
                      color:
                        '#111827',
                      fontSize: 12,
                      fontWeight: 700,
                      textTransform:
                        'uppercase',
                      letterSpacing:
                        '0.05em',
                      py: 1.8,
                      bgcolor:
                        '#F9FAFB',
                    }}
                  >
                    {
                      col.label
                    }
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody
            sx={{
              opacity: loading
                ? 0.6
                : 1,
              transition:
                'opacity 0.3s ease',
            }}
          >
            {loading &&
            rows.length ===
              0 ? (
              <SkeletonRows
                columns={
                  columns
                }
              />
            ) : rows.length ===
              0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length
                  }
                  sx={{
                    borderColor:
                      '#E5E7EB',
                    textAlign:
                      'center',
                    py: 6,
                  }}
                >
                  <Typography
                    fontSize={
                      14
                    }
                    color="#9CA3AF"
                    fontWeight={
                      500
                    }
                  >
                    {emptyText}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              <>
                {rows.map(
                  (
                    row,
                    i
                  ) => (
                    
                    <TableRow
  key={
    row.id ??
    row._id ??
    i
  }
  sx={{
    '&:hover': {
      bgcolor: '#F3F4F6',
    },

    '& td': {
      borderBottom:
        '1px solid #E5E7EB', // visible horizontal line
    },

    '&:last-child td': {
      borderBottom:
        '1px solid #E5E7EB',
    },

    transition:
      'background 0.2s ease',
  }}
>
                      {columns.map(
                        (
                          col
                        ) => (
                          <TableCell
                            key={
                              col.key
                            }
                            sx={{
                              width: col.width,
                              maxWidth: col.width,
                              borderColor:
                                '#F1F5F9',
                              py: 1.4,
                              fontSize: 12,
                              color:
                                '#374151',
                              fontWeight: 500,
                              fontFamily:
                                'Inter, sans-serif',
                            }}
                          >
                            {col.render
                              ? col.render(
                                  row
                                )
                              : row[
                                  col
                                    .key
                                ] ??
                                '—'}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  )
                )}

                {/* Skeleton overlay rows */}
                {loading && (
                  <SkeletonRows
                    columns={
                      columns
                    }
                    count={
                      3
                    }
                  />
                )}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          borderTop:
            '1px solid #E5E7EB',
          bgcolor:
            '#FAFAFA',
        }}
      >
        <TablePagination
          component="div"
          count={total}
          page={page}
          rowsPerPage={
            pageSize
          }
          onPageChange={(
            _,
            p
          ) =>
            onPageChange(
              p
            )
          }
          onRowsPerPageChange={(
            e
          ) =>
            onPageSizeChange(
              +e.target
                .value
            )
          }
          rowsPerPageOptions={[
            10,
            25,
            50,
          ]}
          sx={{
            color:
              '#6B7280',
            fontSize: 12,

            '& .MuiTablePagination-select':
              {
                color:
                  '#374151',
                fontWeight: 600,
              },

            '& .MuiTablePagination-selectIcon':
              {
                color:
                  '#111827',
              },

            '& .MuiTablePagination-displayedRows':
              {
                fontSize: 12,
                fontWeight: 500,
              },

            '& .MuiTablePagination-toolbar':
              {
                minHeight: 56,
              },

            '& .MuiIconButton-root':
              {
                color:
                  '#111827',

                '&:hover':
                  {
                    bgcolor:
                      '#F3F4F6',
                  },
              },

            '& .MuiIconButton-root.Mui-disabled':
              {
                color:
                  '#D1D5DB',
              },
          }}
        />
      </Box>
    </Box>
  )
}
