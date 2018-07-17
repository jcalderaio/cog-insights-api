exports.mdx_response = {
  Info: {
    Error: '',
    TimeStamp: '2018-05-30 12:12:32',
    ResultsComplete: 1,
    PendingResults: 0,
    MDXText:
      'SELECT [%SEARCH] ON 0,NON EMPTY [EVENTTIMED].[H1].[MONTH YEAR].MEMBERS ON 1 FROM [AUDIT EVENTS] WHERE CROSSJOIN(%OR({[EVENT TYPE].[H1].[EVENT TYPE].&[SearchPatient],[EVENT TYPE].[H1].[EVENT TYPE].&[SearchPatientBreakGlass]}),%OR([EVENTTIMED].[H1].[MONTH YEAR].&[201804]:[EVENTTIMED].[H1].[MONTH YEAR].&[201805]))',
    QueryKey: 'en3788168429',
    CubeKey: 'AUDIT EVENTS',
    QueryID: 'AUDIT EVENTS||en3788168429',
    Cube: 'AUDIT EVENTS',
    Pivot: '',
    QueryType: 'SELECT',
    ListingSource: '',
    ColCount: 1,
    RowCount: 2
  },
  AxesInfo: [
    {
      '%ID': 'SlicerInfo',
      Text:
        'CROSSJOIN(%OR({[EVENT TYPE].[H1].[EVENT TYPE].&[SearchPatient],[EVENT TYPE].[H1].[EVENT TYPE].&[SearchPatientBreakGlass]}),%OR([EVENTTIMED].[H1].[MONTH YEAR].&[201804]:[EVENTTIMED].[H1].[MONTH YEAR].&[201805]))'
    },
    {
      '%ID': 'AxisInfo_1',
      Text: '[%SEARCH]'
    },
    {
      '%ID': 'AxisInfo_2',
      Text: 'NON EMPTY [EVENTTIMED].[H1].[MONTH YEAR].MEMBERS'
    }
  ],
  Result: {
    Axes: [
      {
        '%ID': 'Axis_1',
        Tuples: [
          {
            '%ID': 'Tuple_1',
            Members: [],
            MemberInfo: []
          }
        ],
        TupleInfo: [
          {
            '%ID': 'TupleInfo_1',
            childSpec: ''
          }
        ]
      },
      {
        '%ID': 'Axis_2',
        Tuples: [
          {
            '%ID': 'Tuple_1',
            Members: [
              {
                '%ID': 'Member_1',
                Name: 'Apr-2018'
              }
            ],
            MemberInfo: [
              {
                '%ID': 'MemberInfo_1',
                nodeNo: 3,
                text: 'Apr-2018',
                dimName: 'EventTimeD',
                hierName: 'H1',
                levelName: 'Month Year',
                memberKey: '201804',
                dimNo: 3,
                hierNo: 1,
                levelNo: 3,
                aggregate: '',
                orSpec: ''
              }
            ]
          },
          {
            '%ID': 'Tuple_2',
            Members: [
              {
                '%ID': 'Member_1',
                Name: 'May-2018'
              }
            ],
            MemberInfo: [
              {
                '%ID': 'MemberInfo_1',
                nodeNo: 4,
                text: 'May-2018',
                dimName: 'EventTimeD',
                hierName: 'H1',
                levelName: 'Month Year',
                memberKey: '201805',
                dimNo: 3,
                hierNo: 1,
                levelNo: 3,
                aggregate: '',
                orSpec: ''
              }
            ]
          }
        ],
        TupleInfo: [
          {
            '%ID': 'TupleInfo_1',
            childSpec: '[EventTimeD].[H1].[Month Year].&[201804].children'
          },
          {
            '%ID': 'TupleInfo_2',
            childSpec: '[EventTimeD].[H1].[Month Year].&[201805].children'
          }
        ]
      }
    ],
    CellData: [
      {
        '%ID': 'Cell_1',
        ValueLogical: 6010,
        Format: '',
        ValueFormatted: '6,010'
      },
      {
        '%ID': 'Cell_2',
        ValueLogical: 3970,
        Format: '',
        ValueFormatted: '3,970'
      }
    ]
  }
};
