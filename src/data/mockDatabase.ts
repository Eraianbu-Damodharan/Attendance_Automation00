export const mockDatabase = {
  students: [
    {
      id: '1',
      name: 'Alice Johnson',
      registrationNumber: 'ST001',
      dob: '2000-01-15',
      class: '10A',
      subjects: ['Mathematics', 'Physics', 'Chemistry']
    },
    {
      id: '2',
      name: 'Bob Smith',
      registrationNumber: 'ST002',
      dob: '2000-03-22',
      class: '10A',
      subjects: ['Mathematics', 'Physics', 'Chemistry']
    },
    {
      id: '3',
      name: 'Carol Davis',
      registrationNumber: 'ST003',
      dob: '2000-05-10',
      class: '10A',
      subjects: ['Mathematics', 'Physics', 'Biology']
    },
    {
      id: '4',
      name: 'David Wilson',
      registrationNumber: 'ST004',
      dob: '2000-07-08',
      class: '10B',
      subjects: ['English', 'History', 'Geography']
    },
    {
      id: '5',
      name: 'Emma Brown',
      registrationNumber: 'ST005',
      dob: '2000-09-14',
      class: '10B',
      subjects: ['English', 'History', 'Geography']
    },
    {
      id: '6',
      name: 'Frank Miller',
      registrationNumber: 'ST006',
      dob: '2000-11-30',
      class: '10A',
      subjects: ['Mathematics', 'Physics', 'Chemistry']
    },
    {
      id: '7',
      name: 'Grace Taylor',
      registrationNumber: 'ST007',
      dob: '2000-02-18',
      class: '10B',
      subjects: ['English', 'History', 'Art']
    },
    {
      id: '8',
      name: 'Henry Anderson',
      registrationNumber: 'ST008',
      dob: '2000-04-25',
      class: '10A',
      subjects: ['Mathematics', 'Physics', 'Chemistry']
    }
  ],
  
  teachers: [
    {
      id: 't1',
      name: 'Dr. Sarah Mitchell',
      subjects: ['Mathematics', 'Physics'],
      classes: ['10A', '10B']
    },
    {
      id: 't2',
      name: 'Prof. Michael Chen',
      subjects: ['Chemistry', 'Biology'],
      classes: ['10A']
    },
    {
      id: 't3',
      name: 'Ms. Jennifer Lopez',
      subjects: ['English', 'History'],
      classes: ['10B']
    },
    {
      id: 't4',
      name: 'Mr. Robert Thompson',
      subjects: ['Geography', 'Art'],
      classes: ['10B']
    }
  ],

  admins: [
    {
      id: 'a1',
      name: 'Principal Adams',
      password: 'admin123',
      permissions: ['full_access']
    },
    {
      id: 'a2',
      name: 'Vice Principal Johnson',
      password: 'vice456',
      permissions: ['attendance_reports']
    }
  ]
};